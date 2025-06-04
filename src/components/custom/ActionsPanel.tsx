import { motion } from "framer-motion";
import { Settings } from "lucide-react";

export default function ActionsPanel() {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-3"
    >
      {/*   <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
        <Download className="w-4 h-4" />
        Export Graph
      </button> */}
      <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
        <Settings className="w-4 h-4" />
        Settings
      </button>
    </motion.div>
  );
}
