import React from "react";

export default class AgentNumber extends React.Component {
    formatNumber(phoneNumber) {
        if (phoneNumber.substring(0, 1) === "+") {
            phoneNumber = phoneNumber.substring(1);
        }

        if (phoneNumber.substring(0, 1) === "1") {
            phoneNumber = phoneNumber.substring(1);
        }

        let areaCode = phoneNumber.substring(0, 3);
        let exchangeCode = phoneNumber.substring(3, 6);
        let lineNumber = phoneNumber.substring(6, 10);

        return `(${areaCode}) ${exchangeCode}-${lineNumber}`;
    }

    render() {
        let phoneNumber;
        if (this.props.phoneNumber) {
            phoneNumber = this.formatNumber(this.props.phoneNumber);
        } else {
            phoneNumber = "Not Set";
        }

        return (
            <h1 style={{ marginTop: "13px", marginRight: "15px" }}>
                My Number: {phoneNumber}
            </h1>
        );
    }
}
