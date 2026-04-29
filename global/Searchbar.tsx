import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import React , {useState , useEffect} from 'react'

const Searchbar = ({onSearch}:{onSearch : (query:string)=> void}) => {
    const [isFocused,setIsfocused] = useState(false);
    const [input,setInput] = useState('');

    useEffect(()=>{
        const handler = setTimeout(()=>{
            onSearch(input.trim())
        },300);
        return ()=> clearTimeout(handler);
    },[input,onSearch])

    return (
    <div className="
        flex items-center gap-3 
        bg-[#EFF0F0] dark:bg-[#24303E] 
        rounded-lg px-4 py-2 shadow-sm 
        w-full max-w-md
        transition-shadow
        focus-within:shadow-[0_0_8px_#22d3ee,0_0_12px_#2dd4bf]"
        >
        <Search className={ isFocused ? "text-cyan-500" : "text-gray-800" } size={20} />
        <Input
            placeholder="Search User"
            className="bg-transparent border-none focus:ring-0 
            text-gray-900 dark:text-gray-100 
            placeholder-gray-400 dark:placeholder-gray-500"
            value={input}
            onChange={event=>setInput(event.target.value)}
            onFocus={()=>setIsfocused(true)}
            onBlur={()=>setIsfocused(false)}
        />
    </div>
    )
}

export default Searchbar
