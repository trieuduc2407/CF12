import 'cally'
import React from 'react'

const Calendar = ({ showPopover, setShowPopover, date, calendarRef }) => {
    return (
        <>
            <button
                popoverTarget="cally-popover1"
                className="input bg-white outline-1"
                id="cally1"
                onClick={() => setShowPopover(true)}
            >
                {date ? date : 'Tìm kiếm đơn theo ngày'}
            </button>
            <div
                popover
                id="cally-popover1"
                className={`${showPopover ? '' : 'hidden'} dropdown rounded-box bg-white shadow-lg`}
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
        </>
    )
}

export default Calendar
