import {
    IconBuildingFactory2,
    IconCoin,
    IconEdit,
    IconMedicineSyrup,
    IconPackage,
    IconPill,
    IconStack2,
    IconVaccineBottle,
} from "@tabler/icons-react"
import { ActionIcon } from "@mantine/core"
import { medicineCategoryLabels, medicineTypeLabels } from "../../../data/DropDownData"

interface MedicineCardProps {
    name: string
    category: string
    price: string | number
    stock: number
    type: string
    manufacturer: string
    dosage: string
    onEdit: () => void
}

const MedicineCard = ({ name, category, price, stock, type, manufacturer, dosage, onEdit }: MedicineCardProps) => {
    const priceBodyTemplate = (rowData: any) => {
    const value = Number(String(rowData.price ?? 0).replace(",", "."))
    return Number.isFinite(value)
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
      : "R$ 0,00"
  }
  const categoryBodyTemplate = (rowData: any) => {
    return medicineCategoryLabels[rowData.category] ?? rowData.category
  }

  const typeBodyTemplate = (rowData: any) => {
    return medicineTypeLabels[rowData.type] ?? rowData.type
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
                <IconStack2 size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{categoryBodyTemplate({ category })}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconCoin size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{priceBodyTemplate({ price })}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconPackage size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{stock}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconBuildingFactory2 size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{manufacturer || "Não informado"}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconMedicineSyrup size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{typeBodyTemplate({ type })}</div>
            </div>
            <div className="flex items-center text-sm gap-2">
                <IconVaccineBottle size={30} className="text-primary-700 bg-primary-100 rounded-full p-1" />
                <div>{dosage || "Não informado"}</div>
            </div>
        </div>
    )
}

export default MedicineCard
