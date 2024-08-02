import React from 'react'
import { GlobalContext } from "Globalstate.js";

const CompanyWithdrawals = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [riderData, setRiderData] = useState(null);

    const [{ userdetails, compriddetails, loggedin, tradingpair }, dispatch] = useContext(GlobalContext);

    console.log('CHPT b')

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
g



            <WithdrawalModal
                isOpen={isOpen}
                toggle={toggleModal}
                riderData={userdetails}
            />
        </div>
    )
}

export default CompanyWithdrawals