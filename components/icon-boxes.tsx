import { DollarSign, Headset, ShoppingBagIcon, WalletCards } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const IconBoxes = () => {
  return (
    <div>
      <Card>
        <CardContent className="grid md:grid-cols-4 gap-4 p-4">
          <div className="space-y-2">
            <ShoppingBagIcon></ShoppingBagIcon>
            <div className="text-sm font-bold">Free Shipping</div>
            <div className="text-sm text-muted-foreground">
              Free shipping on orders above 100$
            </div>
          </div>
          <div className="space-y-2">
            <DollarSign></DollarSign>
            <div className="text-sm font-bold">Money back Guarentee</div>
            <div className="text-sm text-muted-foreground">
              Within 30 days of purchase
            </div>
          </div>
          <div className="space-y-2">
            <WalletCards/>
            <div className="text-sm font-bold">Flexible payments</div>
            <div className="text-sm text-muted-foreground">
              Pay with Credit Card, Paypal or COD
            </div>
          </div>
          <div className="space-y-2">
            <Headset></Headset>
            <div className="text-sm font-bold">24/7 Support</div>
            <div className="text-sm text-muted-foreground">
              Get support at any time
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IconBoxes;
