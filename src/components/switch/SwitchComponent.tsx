"use client"
import React, { useState } from 'react'
import { Switch } from '../ui/switch';

interface SwitchComponentProps {
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

export const SwitchComponent = ({ defaultChecked = false, onCheckedChange }: SwitchComponentProps) => {
    const [checked, setChecked] = useState(defaultChecked);

    const handleCheckedChange = (newChecked: boolean) => {
        setChecked(newChecked);
        onCheckedChange?.(newChecked);
    };

    return (
        <Switch
            checked={checked}
            onCheckedChange={handleCheckedChange}
            className='w-13 h-7.5 pl-[2px] data-[state=checked]:!bg-mainColor data-[state=unchecked]:!bg-switchBgColor shadow-none border-0 focus-visible:ring-gColor/20 focus-visible:ring-[2px] [&_span]:!bg-white [&_span]:w-6.5 [&_span]:h-6.5 [&_span]:data-[state=checked]:!translate-x-[calc(100%-4px)] [&_span]:data-[state=unchecked]:!translate-x-3px [&_span]:shadow-[0px_3px_8px_0px_#00000026]'
            aria-label='Notification Switch'
        />
    )
}

export default SwitchComponent