import Image from "next/image";
import styles from "./page.module.css";
import Main from "@/components/Main";
import Footer from "@/components/Footer";



export default function Home() {
  return (
    <div className={styles.wrapper}>
      <Main/>
      <Footer/>
    </div>
  );
}
