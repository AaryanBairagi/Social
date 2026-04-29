import NotificationItem from "./NotificationItem";

export default function NotificationGroup({ title, items }: any) {
  if (!items.length) return null;

  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">{title}</h2>

      <div className="flex flex-col gap-2">
        {items.map((item: any) => (
          <NotificationItem key={item._id} notification={item} />
        ))}
      </div>
    </div>
  );
}