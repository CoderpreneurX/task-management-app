import TaskList from "@/components/TaskList";

const Home = async ({}) => {
  return (
    <div className="h-screen">
      <h1 className="text-2xl sm:text-4xl font-black fixed w-full top-0 tracking-wide text-center pt-6">
        Welcome to Task Manager
      </h1>

      <div className="flex justify-center">
        <TaskList />
      </div>
    </div>
  );
};

export default Home;
