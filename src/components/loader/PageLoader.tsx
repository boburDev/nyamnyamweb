import styles from "./loading.module.css";
export const PageLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className={`w-full h-full bg-gradient-to-r from-blue-500 via-purple-600 to-purple-500 ${styles.loadingBar}`}
      />
    </div>
  );
};

export default PageLoader;
