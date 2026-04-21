import {
    IconCalendarTime,
    IconCoin,
    IconEye,
    IconPhone,
    IconUserHeart,
} from "@tabler/icons-react"
import { ActionIcon } from "@mantine/core"
import { formatDateWithTime } from "../../../utilities/DateUtility"

interface SalesCardProps {
    buyerName: string
    totalAmount: number | null
    contactPhone: string
    saleDate: string | number
    stockStatus: string
    onViewSale: () => void
}

const SalesCard = ({ buyerName, totalAmount, contactPhone, saleDate, onViewSale }: SalesCardProps) => {
      const totalAmountBodyTemplate = (rowData: any) => {
    return `R$ ${Number(rowData.totalAmount || 0).toFixed(2)}`
  }
    return (
        <div className="flex flex-col bg-slate-200 rounded-xl p-5 gap-2 cursor-pointer hover:shadow-[0_0_4px_1px_blue] shadow-primary-500! hover:bg-slate-300 transition duration-300 ease-in-out">
            <div className="flex items-center gap-3">
                <IconUserHeart size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div className="text-lg font-semibold text-primary-500">{`${buyerName}`}</div>
                <div className="flex gap-2">
                    <ActionIcon
                        color="primary"
                        variant="subtle"
                        onClick={(event) => {
                            event.stopPropagation()
                            onViewSale()
                        }}
                    >
                        <IconEye size={20} stroke={1.5} />
                    </ActionIcon>
                </div>
            </div>
            
            <div className="flex items-center text-sm gap-2">
                <IconCalendarTime size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{formatDateWithTime(saleDate)}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconCoin size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{ totalAmountBodyTemplate({ totalAmount }) }</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconPhone size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{contactPhone}</div>
            </div>
        </div>
    )
}

export default SalesCard
