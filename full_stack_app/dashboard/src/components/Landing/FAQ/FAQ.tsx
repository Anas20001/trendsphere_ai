@@ .. @@
 export function FAQ() {
   const [openIndex, setOpenIndex] = useState<number | null>(null);
+  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
 
   return (
     <div className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
@@ .. @@
           {faqs.map((faq, index) => (
             <div
               key={index}
-              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
+              onMouseEnter={() => setHoveredIndex(index)}
+              onMouseLeave={() => setHoveredIndex(null)}
+              className={`
+                bg-white dark:bg-gray-800 rounded-lg
+                transition-all duration-300
+                ${hoveredIndex === index 
+                  ? 'shadow-md transform -translate-y-0.5' 
+                  : 'shadow-sm hover:shadow'
+                }
+              `}
             >
               <button
                 className="w-full px-6 py-4 text-left focus:outline-none"
                 onClick={() => setOpenIndex(openIndex === index ? null : index)}
               >
@@ .. @@
               </button>
               {openIndex === index && (
-                <div className="px-6 pb-4">
+                <div className="px-6 pb-4 animate-fadeIn">
                   <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                 </div>
               )}