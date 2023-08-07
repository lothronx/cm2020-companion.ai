import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

export default function Home() {
  return (
    <main>
      <h1>Companion.ai</h1>
      <p>The AI Companion who can detect your emotions</p>
      <button>register</button>
      <button>login</button>
    </main>
  );
}
