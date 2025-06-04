import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="p-6 border-b border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        FDA 510(k) Explorer
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Interactive device relationship visualization
      </p>
    </motion.div>
  );
}
