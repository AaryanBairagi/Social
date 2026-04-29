"use client";

type Props = {
  title: string;
  icon?: React.ReactNode;
};

export default function SectionHeader({ title, icon }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white/60 rounded-t-2xl shadow border-b border-gray-200 mb-4">
      <div className="flex w-full items-center gap-3">
        {icon && <div className="text-cyan-600">{icon}</div>}

        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          {title}
        </h1>
      </div>
    </div>
  );
}