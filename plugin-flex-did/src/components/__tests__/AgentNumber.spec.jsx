import React from "react";
import { shallow } from "enzyme";
import AgentNumber from "../AgentNumber/AgentNumber.jsx";

describe("AgentNumber", () => {
    it("should render the number in US domestic format if provided", () => {
        const wrapper = shallow(<AgentNumber phoneNumber="+12345678900" />);
        expect(wrapper.render().text()).toMatch("My Number: (234) 567-8900");
    });

    it("should tell the user their number is not set if not provided", () => {
        const wrapper = shallow(<AgentNumber phoneNumber="" />);
        expect(wrapper.render().text()).toMatch("My Number: Not Set");
    });
});
