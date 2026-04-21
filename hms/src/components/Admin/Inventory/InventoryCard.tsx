import {
    IconCalendarTime,
    IconEdit,
    IconPackage,
    IconPackages,
    IconPill,
    IconProgress,
} from "@tabler/icons-react"
import { ActionIcon } from "@mantine/core"

import { Tag } from "primereact/tag"

interface InventoryCardProps {
    name: string
    expireDate: string | null
    batchNo: string
    quantity: string | number
    stockStatus: string
    onEdit: () => void
}

const InventoryCard = ({ name, expireDate, batchNo, quantity, stockStatus, onEdit }: InventoryCardProps) => {
    const statusBodyTemplate = (rowData: any) => {
        return rowData.stockStatus === "ACTIVE" ? (<Tag severity="success" value="Ativo" />) : (
          <Tag severity="danger" value="Inativo" />
        )
      }
    return (
        <div className="flex flex-col bg-slate-200 rounded-xl p-2 gap-2 cursor-pointer hover:shadow-[0_0_4px_1px_blue] shadow-primary-500! hover:bg-slate-300 transition duration-300 ease-in-out">
            <div className="flex items-center gap-3">
                <IconPill size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div className="text-lg font-semibold text-primary-500">{`${name}`}</div>
                <div className="flex gap-2">
                    <ActionIcon
                        color="primary"
                        variant="subtle"
                        onClick={(event) => {
                            event.stopPropagation()
                            onEdit()
                        }}
                    >
                        <IconEdit size={20} stroke={1.5} />
                    </ActionIcon>
                </div>
            </div>
            
            <div className="flex items-center text-sm gap-2">
                <IconCalendarTime size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{expireDate}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconPackage size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{ batchNo }</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconPackages size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{quantity}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconProgress size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{statusBodyTemplate({ stockStatus })}</div>
            </div>
        </div>
    )
}

export default InventoryCard
