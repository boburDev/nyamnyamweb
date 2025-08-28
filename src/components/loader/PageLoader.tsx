import styles from "./loading.module.css";
export const PageLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className={`w-full h-full bg-gradient-to-r from-violet-500 via-green-500 to-mainColor ${styles.loadingBar}`}
      />
    </div>
  );
};

export default PageLoader;
