from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from my_agent.DatabaseManager import DatabaseManager
from my_agent.LLMManager import LLMManager

class SQLAgent:
    def __init__(self):
        self.db_manager = DatabaseManager()
        self.llm_manager = LLMManager()

    def parse_question(self, state: dict) -> dict:
        """Parse user question and identify relevant tables and columns."""
        question = state['question']
        schema = self.db_manager.get_schema(state['uuid'])
        print(f"schema: {schema}")
        prompt = ChatPromptTemplate.from_messages([
            ("system", '''You are a data analyst specializing in product bundling analysis. 
Given the question and database schema, identify tables and columns related to:
- Sales transactions and order details
- Product information and categories
- Customer purchase history
- Pricing and margin data
- Seasonal sales patterns

Your response should be in the following JSON format:
{{
    "is_relevant": boolean,
    "relevant_tables": [
        {{
            "table_name": string,
            "columns": [string],
            "noun_columns": [string]
        }}
    ]
}}
The "noun_columns" field should contain only the columns that are relevant to the question and contain nouns or names, for example, the column "Artist name" contains nouns relevant to the question "What are the top selling artists?", but the column "Artist ID" is not relevant because it does not contain a noun. Do not include columns that contain numbers.
Include columns containing product names, categories, prices, quantities, order dates, and customer identifiers.
'''),
            ("human", "===Database schema:\n{schema}\n\n===User question:\n{question}\n\nIdentify relevant tables and columns:")
        ])

        output_parser = JsonOutputParser()
        
        response = self.llm_manager.invoke(prompt, schema=schema, question=question)
        parsed_response = output_parser.parse(response)
        return {"parsed_question": parsed_response}

    def get_unique_nouns(self, state: dict) -> dict:
        """Find unique nouns in relevant tables and columns."""
        parsed_question = state['parsed_question']
        
        if not parsed_question['is_relevant']:
            return {"unique_nouns": []}

        unique_nouns = set()
        for table_info in parsed_question['relevant_tables']:
            table_name = table_info['table_name']
            noun_columns = table_info['noun_columns']
            
            if noun_columns:
                column_names = ', '.join(f'"{col}"' for col in noun_columns)
                query = f'SELECT DISTINCT {column_names} FROM "{table_name}"'
                results = self.db_manager.execute_query(query)
                # Add complete values, not characters
                for row in results:
                    unique_nouns.update([str(value) for value in row if value is not None])

        return {"unique_nouns": list(unique_nouns)}

    def generate_sql(self, state: dict) -> dict:
        """Generate SQL query based on parsed question and unique nouns."""
        question = state['question']
        parsed_question = state['parsed_question']
        unique_nouns = state['unique_nouns']

        if not parsed_question['is_relevant']:
            return {"sql_query": "NOT_RELEVANT", "is_relevant": False}
    
        schema = self.db_manager.get_schema(state['uuid'])

        prompt = ChatPromptTemplate.from_messages([
            ("system", '''You are an AI assistant that generates PostgreSQL queries to analyze product bundling opportunities, based on user questions, database schema, and unique nouns found in the relevant tables. 
             Generate a valid PostgreSQL query to answer the user's question.

Generate PostgreSQL queries that:
1. Identify frequently co-purchased products using window functions and self-joins
2. Calculate bundle profitability metrics (combined margins, total revenue)
3. Analyze seasonal purchase patterns
4. Examine customer segment preferences
5. Calculate price sensitivity metrics


Example queries for reference "but tables here is not exactly relevant":
1. Frequently co-purchased items:
SELECT p1.product_name, p2.product_name, COUNT(*) as co_purchase_frequency
FROM orders o1
JOIN order_items oi1 ON o1.order_id = oi1.order_id 
JOIN order_items oi2 ON o1.order_id = oi2.order_id
JOIN products p1 ON oi1.product_id = p1.product_id
JOIN products p2 ON oi2.product_id = p2.product_id
WHERE p1.product_id < p2.product_id
GROUP BY p1.product_name, p2.product_name
ORDER BY co_purchase_frequency DESC;

2. Bundle profitability:
SELECT p1.product_name, p2.product_name,
       AVG(p1.price + p2.price) as bundle_price,
       AVG(p1.margin + p2.margin) as bundle_margin
FROM frequently_bought_together fbt
JOIN products p1 ON fbt.product1_id = p1.product_id
JOIN products p2 ON fbt.product2_id = p2.product_id
GROUP BY p1.product_name, p2.product_name;
'''),
            ("human", '''===Database schema:
{schema}

===User question:
{question}

===Relevant tables and columns:
{parsed_question}

===Unique nouns in relevant tables:
{unique_nouns}

Generate SQL query string'''),
        ])

        response = self.llm_manager.invoke(prompt, schema=schema, question=question, 
                                           parsed_question=parsed_question, 
                                           unique_nouns=unique_nouns)
        
        if response.strip() == "NOT_ENOUGH_INFO":
            return {"sql_query": "NOT_RELEVANT"}
        else:
            return {"sql_query": response}

    def validate_and_fix_sql(self, state: dict) -> dict:
            """Validate and fix the generated SQL query."""
            sql_query = state['sql_query']

            if sql_query == "NOT_RELEVANT":
                return {"sql_query": "NOT_RELEVANT", "sql_valid": False}
            
            schema = self.db_manager.get_schema(state['uuid'])

            prompt = ChatPromptTemplate.from_messages([
                ("system", '''
    You are an AI assistant that validates and fixes PostgreSQL queries. Your task is to:
    1. Check if the PostgreSQL query is valid.
    2. Ensure all table and column names are correctly spelled and exist in the schema. All the table and column names should be enclosed in double quotes (") for identifiers (table/column names).
    3. If there are any issues, fix them and provide the corrected PostgresSQL query.
    4. If no issues are found, return the original query.

    Respond in JSON format with the following structure. Only respond with the JSON:
    {{
        "valid": boolean,
        "issues": string or null,
        "corrected_query": string
    }}
    '''),
                ("human", '''===Database schema:
    {schema}

    ===Generated SQL query:
    {sql_query}

    Respond in JSON format with the following structure. Only respond with the JSON:
    {{
        "valid": boolean,
        "issues": string or null,
        "corrected_query": string
    }}

    For example:
    1. {{
        "valid": true,
        "issues": null,
        "corrected_query": "None"
    }}
                
    2. {{
        "valid": false,
        "issues": "Column USERS does not exist",
        "corrected_query": "SELECT * FROM \"users\" WHERE age > 25"
    }}

    3. {{
        "valid": false,
        "issues": "Column names and table names should be enclosed in d
        
        
        
        
        
        
        ouble quaotes if they contain spaces or special characters",
        "corrected_query": "SELECT * FROM \"gross income\" WHERE \"age\" > 25"
    }}
                
    '''),
            ])

            output_parser = JsonOutputParser()
            response = self.llm_manager.invoke(prompt, schema=schema, sql_query=sql_query)
            result = output_parser.parse(response)

            if result["valid"] and result["issues"] is None:
                return {"sql_query": sql_query, "sql_valid": True}
            else:
                return {
                    "sql_query": result["corrected_query"],
                    "sql_valid": result["valid"],
                    "sql_issues": result["issues"]
                }

    def execute_sql(self, state: dict) -> dict:
        """Execute SQL query and return results."""
        query = state['sql_query']
        uuid = state['uuid']
        
        if query == "NOT_RELEVANT":
            return {"results": "NOT_RELEVANT"}

        try:
            print("I am here in execute_sql")
            print(query)
            results = self.db_manager.execute_query(query)
            print("I am results: ",results)
            return {"results": results}
        except Exception as e:
            return {"error": str(e)}

    def format_results(self, state: dict) -> dict:
            """Format query results into a human-readable response."""
            question = state['question']
            results = state['results']

            if results == "NOT_RELEVANT":
                return {"answer": "Sorry, I can only give answers relevant to the database."}

            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are an AI assistant that formats database query results into a human-readable response. Give a conclusion to the user's question based on the query results. Do not give the answer in markdown format. Only give the answer in one line."),
                ("human", "User question: {question}\n\nQuery results: {results}\n\nFormatted response:"),
            ])

            response = self.llm_manager.invoke(prompt, question=question, results=results)
            return {"answer": response}


    def choose_visualization(self, state: dict) -> dict:
        """Choose an appropriate visualization for the data."""
        question = state['question']
        results = state['results']
        sql_query = state['sql_query']

        if results == "NOT_RELEVANT":
            return {"visualization": "none", "visualization_reasoning": "No visualization needed for irrelevant questions."}

        prompt = ChatPromptTemplate.from_messages([
            ("system", '''
You are an AI assistant that recommends appropriate data visualizations. Based on the user's question, SQL query, and query results, suggest the most suitable type of graph or chart to visualize the data. If no visualization is appropriate, indicate that.

Available chart types and their use cases:
- Bar Graphs: Best for comparing categorical data or showing changes over time when categories are discrete and the number of categories is more than 2. Use for questions like "What are the sales figures for each product?" or "How does the population of cities compare? or "What percentage of each city is male?"
- Horizontal Bar Graphs: Best for comparing categorical data or showing changes over time when the number of categories is small or the disparity between categories is large. Use for questions like "Show the revenue of A and B?" or "How does the population of 2 cities compare?" or "How many men and women got promoted?" or "What percentage of men and what percentage of women got promoted?" when the disparity between categories is large.
- Scatter Plots: Useful for identifying relationships or correlations between two numerical variables or plotting distributions of data. Best used when both x axis and y axis are continuous. Use for questions like "Plot a distribution of the fares (where the x axis is the fare and the y axis is the count of people who paid that fare)" or "Is there a relationship between advertising spend and sales?" or "How do height and weight correlate in the dataset? Do not use it for questions that do not have a continuous x axis."
- Pie Charts: Ideal for showing proportions or percentages within a whole. Use for questions like "What is the market share distribution among different companies?" or "What percentage of the total revenue comes from each product?"
- Line Graphs: Best for showing trends and distributionsover time. Best used when both x axis and y axis are continuous. Used for questions like "How have website visits changed over the year?" or "What is the trend in temperature over the past decade?". Do not use it for questions that do not have a continuous x axis or a time based x axis.

Consider these types of questions when recommending a visualization:
1. Aggregations and Summarizations (e.g., "What is the average revenue by month?" - Line Graph)
2. Comparisons (e.g., "Compare the sales figures of Product A and Product B over the last year." - Line or Column Graph)
3. Plotting Distributions (e.g., "Plot a distribution of the age of users" - Scatter Plot)
4. Trends Over Time (e.g., "What is the trend in the number of active users over the past year?" - Line Graph)
5. Proportions (e.g., "What is the market share of the products?" - Pie Chart)
6. Correlations (e.g., "Is there a correlation between marketing spend and revenue?" - Scatter Plot)

Provide your response in the following format:
Recommended Visualization: [Chart type or "None"]. ONLY use the following names: bar, horizontal_bar, line, pie, scatter, none
Reason: [Brief explanation for your recommendation]
'''),
            ("human", '''
User question: {question}
SQL query: {sql_query}
Query results: {results}

Recommend a visualization:'''),
        ])

        response = self.llm_manager.invoke(prompt, question=question, sql_query=sql_query, results=results)
        
        lines = response.split('\n')
        visualization = lines[0].split(': ')[1]
        reason = lines[1].split(': ')[1]

        return {"visualization": visualization, "visualization_reason": reason}
