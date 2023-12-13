import { Layout } from "@/components";
import { useSession } from "next-auth/react";

const Home = () => {
  const { data: session } = useSession();
  return (
    <Layout>
      <div className="">
        <p className="text-2xl">
          Hello, <strong>{session?.user?.name}</strong>{" "}
        </p>
      </div>
    </Layout>
  );
}

export default Home;