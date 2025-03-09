interface MyInputProps {
    placeholder: string
    value: string
    setValue: React.Dispatch<React.SetStateAction<string>>
}

export default function MyInput(props: MyInputProps) {
    return <input 
        className="border border-gray-200 rounded-md p-2 px-3 outline-none text-gray-600" 
        placeholder={props.placeholder} 
        value={props.value}
        onChange={e => props.setValue(e.target.value)}
    />
}
