import { Metadata } from "next";
import { getOrderById } from "@/lib/actions/order.action";
import { notFound } from "next/navigation";
import { ShippingAddress } from "@/types";

export const metadata : Metadata = {
 title:'Order details'
}

const OrderDetailsPage = async (props:{params:Promise<{id: string}>}) => {
    
    const {id} = await props.params;
    const order = getOrderById(id);

    if(!order){
        notFound()
    }

    

    
    return ( <>Details</>  );
}
 
export default OrderDetailsPage;