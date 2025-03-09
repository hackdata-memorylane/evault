import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface MyButtonProps {
    text: string;
    className?: string;
    onClick?: () => void;
    href?: string;
    icon?: IconDefinition;
}

export default function MyButton(props: MyButtonProps) {
    return <a href={props.href}>
        <button 
            className={`
                bg-[#EE9B00] p-4 px-6 rounded-lg text-white font-bold text-lg
                ${props.className}
            `}
            onClick={props.onClick}
        >
            <div className="flex gap-2 justify-center items-center">
                {props.icon && <FontAwesomeIcon icon={props.icon} />}

                <div>{props.text}</div>
            </div>
        </button>
    </a>
}
