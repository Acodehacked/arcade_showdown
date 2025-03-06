import Image from "next/image";
import { collection, getDocs, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from "@/firebase";

type MyDataType = {
  college: string;
  level: number,
  stream: string;
  trophies: number,
  user_name:string;
  user_email:string;
  user_phone:string;
  year: number;
}

export default async function Home() {
  async function getAllDocuments<T>(collectionName: string): Promise<T[]> {
    const q = query(collection(db, collectionName), orderBy('trophies', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
  }

  async function getMyCollection() {
    try {
      const data:MyDataType[] = await getAllDocuments<MyDataType>('myCollection') as MyDataType[];
      return data;
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  const db = getFirestore(app);
  const data: MyDataType[] = await getAllDocuments<MyDataType>("gamers");
  console.log(data);
  return (
    <div className="flex items-start flex-col justify-items-center min-h-screen px-8 py-2 pb-20 gap-16 sm:px-10 sm:py-10 ">
      <main className="flex w-full justify-between items-center gap-8 ">
        <Image
          className=""
          src="/logo.png"
          alt="logo"
          width={180}
          height={38}
          priority
        />
        <Image
          aria-hidden
          src="/leaderboardTitle.png"
          alt="File icon"
          className="w-auto sm:flex hidden h-12"
          width={100}
          height={100}
        />
        <Image
          aria-hidden
          src="/asthra.png"
          alt="File icon"
          className="w-auto h-12"
          width={100}
          height={100}
        />
      </main>
      <Image
        aria-hidden
        src="/leaderboardTitle.png"
        alt="File icon"
        className="w-auto sm:hidden flex h-12"
        width={100}
        height={100}
      />
      <section>
        <h1 className="sm:text-3xl text-xl font-bold text-yellow-400">
          Welcome to the Arcade Showdown
        </h1>
        <p className="sm:text-lg text-sm mt-2 text-gray-400">
          A collection of classic arcade games
        </p>
      </section>
      <section className="w-full flex flex-col items-center">
        <h2 className="sm:text-2xl text-xl font-bold text-yellow-400">
          Leaderboard
        </h2>
        <ul className="w-full mt-4 space-y-4">
          {data.map((row, index) => (
            <li key={index} className="flex justify-between gap-2 items-center p-4 bg-gray-800 rounded-lg">
              <span className="text-yellow-400 font-bold">{index + 1}</span>
              <span className="text-white text-center">{row?.user_name+", "+row?.stream+", "+(row?.college.length > 20 ? row?.college.substring(0,18): row?.college)}</span>
              <span className="text-yellow-400 font-bold">{row.trophies}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
