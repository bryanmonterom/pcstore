import { generateAccessToken, paypal } from "../lib/paypal";

//Test to generate access token from paypal
test('Generates a token from paypal', async () =>{
    const tokenResponse = await generateAccessToken();
    console.log(tokenResponse)

    expect(typeof tokenResponse).toBe('string')
    expect(tokenResponse.length).toBeGreaterThan(0)

})

//Test to create an order
test('Create paypal Order', async () =>{
    const price = 10.0
    const response = await paypal.createOrder(price);
    console.log(response)

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('status');
    expect(response.status).toBe('CREATED');
})

test('Simulate capturing a payment from an order', async () =>{
    const orderId = '100';

    const mockCapturePayment = jest.spyOn(paypal ,'capturePayment').mockResolvedValue({status:'COMPLETED'})

    const response = await paypal.capturePayment(orderId);
    console.log(response)

    expect(response).toHaveProperty('status');
    expect(response.status).toBe('COMPLETED');
    mockCapturePayment.mockRestore()
})