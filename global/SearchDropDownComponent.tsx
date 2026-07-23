import Image from 'next/image';
import Link from 'next/link';

interface UserSearch{
    username:string;
    firstName:string;
    lastName:string;
    profilePhoto?:string;
}

interface SearchDropDownProps{
    user : UserSearch;
    onClick?:()=>void 
}

export function SearchDropdownItem({ user, onClick } : SearchDropDownProps) {
    return (
    <Link
        href={`/profile/${user.username}`}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-100 transition-colors cursor-pointer"
    >
    <img
        src={user.profilePhoto || '/User-Prof.png'}
        alt={user.username}
        className="rounded-full object-cover"
        width={36}
        height={36}
    />
    <div className="flex flex-col min-w-0">
        <span className="font-medium truncate">{user.firstName} {user.lastName}</span>
        <span className="text-xs text-zinc-500 truncate">@{user.username}</span>
    </div>
    </Link>
  );
}
