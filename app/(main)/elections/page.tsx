import { ElectionList } from "@/features/elections/components/ElectionList";

export default function ElectionsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Elections</h1>
      <ElectionList />
    </div>
  );
}
