import 'cally'
import React, { useEffect, useRef, useState } from 'react'

const Calendar = ({ showPopover, setShowPopover, date, calendarRef }) => {
    const buttonRef = useRef(null)
    const popoverRef = useRef(null)
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
        if (showPopover && buttonRef.current && popoverRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            setPopoverPosition({
                top: rect.bottom + 8,
                left: rect.left,
            })
            // Manually show popover
            try {
                popoverRef.current.showPopover()
            } catch {
                // Popover already showing
            }
        } else if (!showPopover && popoverRef.current) {
            // Manually hide popover
            try {
                popoverRef.current.hidePopover()
            } catch {
                // Popover already hidden
            }
        }
    }, [showPopover])

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showPopover &&
                popoverRef.current &&
                buttonRef.current &&
                !popoverRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setShowPopover(false)
            }
        }

        if (showPopover) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showPopover, setShowPopover])

    return (
        <div className="relative flex-1">
            <button
                ref={buttonRef}
                className="input w-full bg-white outline-1"
                id="cally1"
                onClick={() => setShowPopover(!showPopover)}
            >
                {date ? date : 'Tìm kiếm đơn theo ngày'}
            </button>
            <div
                ref={popoverRef}
                popover="manual"
                id="cally-popover1"
                className="dropdown rounded-box fixed z-[1000] m-0 bg-white p-4 shadow-lg"
                style={{
                    top: `${popoverPosition.top}px`,
                    left: `${popoverPosition.left}px`,
                    inset: 'unset',
                }}
            >
                <calendar-date class="cally" ref={calendarRef}>
                    <svg
                        aria-label="Previous"
                        className="size-4 fill-current"
                        slot="previous"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M15.75 19.5 8.25 12l7.5-7.5"></path>
                    </svg>
                    <svg
                        aria-label="Next"
                        className="size-4 fill-current"
                        slot="next"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
                    </svg>
                    <calendar-month></calendar-month>
                </calendar-date>
            </div>
        </div>
    )
}

export default Calendar
