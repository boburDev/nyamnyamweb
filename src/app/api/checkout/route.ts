import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let lastCheckout: any = null;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // yangi checkout
    lastCheckout = {
      id: Date.now(),
      ...body,
      status: "pending",
      createdAt: new Date(),
    };

    return NextResponse.json(
      { success: true, checkout: lastCheckout },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}

export async function GET() {
  if (!lastCheckout) {
      console.log("Checkout mavjud emas");
    return NextResponse.json(
      { success: false, message: "Checkout mavjud emas" },
      { status: 404 }
    );
}else{
    console.log("Checkout mavjud");
}

  return NextResponse.json(lastCheckout, { status: 200 });
}
