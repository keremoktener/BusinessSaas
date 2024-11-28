import { Button, drawerNavigations } from "./DrawerNavigations";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";

export default function DrawerButtonRenderer() {
  const dispatch = useDispatch<AppDispatch>();
  const userRoles = useSelector((state: RootState) => state.userSlice.userRoleList);

  // Check if user has "MEMBER" and another role, in which case we include "BASIC" buttons
  const hasMemberAndOtherRoles = userRoles.includes("MEMBER") && userRoles.length > 1;

  // Get BASIC role buttons only if the user has both "MEMBER" and another role
  const basicRoleButtons = hasMemberAndOtherRoles ? drawerNavigations["BASIC"] || [] : [];

  // Get buttons for all roles except BASIC and MEMBER
  const otherRoleButtons = userRoles
    .filter((role: string) => role !== "BASIC" && role !== "MEMBER")
    .flatMap((role: string) => drawerNavigations[role] || []);

  // Get MEMBER role buttons if user has MEMBER role
  const memberRoleButtons = userRoles.includes("MEMBER") ? drawerNavigations["MEMBER"] || [] : [];

  // Combine all buttons: BASIC first if applicable, other roles in between, MEMBER last
  const roleButtons = [...basicRoleButtons, ...otherRoleButtons, ...memberRoleButtons];

  return (
    <div>
      {roleButtons.map((button: Button, index: number) => {
        if (button.type === 'button') {
          const ButtonComponent = button.component;
          return <ButtonComponent key={index} {...button.props} />;
        } else if (button.type === 'collapse') {
          const CollapseButtonComponent = button.component;
          return <CollapseButtonComponent key={index} {...button.props} />;
        }
        return null;
      })}
    </div>
  );
}
