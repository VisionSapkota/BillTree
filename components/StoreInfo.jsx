import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StoreInfo = ({ label, icon, info }) => {
    return (
        <div className="mt-5">
            <label className="block text-sm font-medium text-gray-600"><FontAwesomeIcon icon={icon} /> {label}</label>
            <p className="text-lg font-semibold">{info}</p>
        </div>
    )
}

export default StoreInfo