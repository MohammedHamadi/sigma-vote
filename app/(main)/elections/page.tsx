import { ElectionList } from "@/features/elections/components/ElectionList";

export default function ElectionsPage() {
  return (
    <div className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-20 mt-10">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold font-serif text-white mb-3">Active Elections</h1>
        <p className="text-xl text-muted-foreground max-w-2xl font-sans">
          Secure, mathematically verifiable voting events currently open for participation or in setup phase.
        </p>
      </div>

      {/* Election Grid */}
      <ElectionList />
    </div>
  );
}

