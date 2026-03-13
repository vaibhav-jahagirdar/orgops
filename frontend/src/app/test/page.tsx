import { Sidebar } from "@/components/dashboard/sidebar/page"
import { Topbar } from "@/components/dashboard/topbar/page"

export default function Test() {
  return (
    <Sidebar 
      currentOrg={{ id: 1, name: "V_Webstudio", role: "owner" }}  orgs={[{id: 1, name: "V_Webstudio", role: "owner"}, {id: 2, name: "V_Webstudio", role: "admin"}]}
    />
  )
}