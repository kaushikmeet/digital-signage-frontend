import GroupLayoutEditor from "./GroupLayoutEditor";

export default function CreateGroupModal({
  open,
  onClose,
  onCreated
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="bg-gray-900 w-[720px] rounded-xl p-5">
        <div className="flex justify-between mb-3">
          <h2 className="font-semibold text-lg">➕ Create Screen Group</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <GroupLayoutEditor
          onCreated={() => {
            onCreated();
            onClose();
          }}
        />
      </div>
    </div>
  );
}
