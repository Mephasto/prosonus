"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Calendar, Download, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DatePickerWithRange } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Product, Categories } from "@/lib/types";

export default function QuotePage({
  products,
  categories,
}: {
  products: Product[];
  categories: Categories;
}) {
  const [quoteItems, setQuoteItems] = useState([
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 },
  ]);
  const [dateRange, setDateRange] = useState({ from: new Date(), to: null });
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const handleQuantityChange = (productId, change) => {
    setQuoteItems((prev) => {
      const updated = prev.map((item) => {
        if (item.productId === productId) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updated;
    });
  };

  const handleRemoveItem = (productId) => {
    setQuoteItems((prev) =>
      prev.filter((item) => item.productId !== productId),
    );
  };

  const handleAddProduct = () => {
    // In a real app, this would open a modal to select products from the catalog
    alert(
      "In a complete implementation, this would open a product selection modal",
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateQuote = () => {
    // In a real app, this would submit the quote to the server
    const quoteData = {
      customer: customerInfo,
      dateRange,
      items: quoteItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return {
          product,
          quantity: item.quantity,
          subtotal: product.price * item.quantity,
        };
      }),
      totalDays: dateRange.to
        ? Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24))
        : 1,
    };

    console.log("Quote created:", quoteData);
    alert(
      "Quote created successfully! In a complete implementation, this would be saved to a database and could be emailed to the customer.",
    );
  };

  // Calculate rental duration in days
  const rentalDays = dateRange.to
    ? Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24))
    : 1;

  // Calculate totals
  const subtotal = quoteItems.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const total = subtotal * rentalDays;

  return (
    <div>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Create Rental Quote
            </h1>
            <p className="text-muted-foreground">
              Select equipment, rental period, and provide your information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Selected Equipment</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleAddProduct}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Equipment you want to include in your rental quote
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {quoteItems.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      No items added to quote yet. Browse the catalog to add
                      items.
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Daily Rate</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Subtotal</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quoteItems.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.productId,
                          );
                          if (!product) return null;

                          return (
                            <TableRow key={item.productId}>
                              <TableCell>
                                <div className="font-medium">
                                  {product.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {product.brand}
                                </div>
                              </TableCell>
                              <TableCell>${product.price}/day</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleQuantityChange(item.productId, -1)
                                    }
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span>{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() =>
                                      handleQuantityChange(item.productId, 1)
                                    }
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                ${product.price * item.quantity}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleRemoveItem(item.productId)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rental Period</CardTitle>
                  <CardDescription>
                    Select the start and end dates for your rental
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-auto">
                      <DatePickerWithRange
                        date={dateRange}
                        setDate={setDateRange}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between">
                        <span>Rental Duration:</span>
                        <Badge variant="outline">
                          {rentalDays} day{rentalDays !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Equipment will be available for pickup on the start date
                        and must be returned by the end date.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>
                    Provide your contact details for the quote
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        name="company"
                        value={customerInfo.company}
                        onChange={handleInputChange}
                        placeholder="Company Name"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Input
                        id="notes"
                        name="notes"
                        value={customerInfo.notes}
                        onChange={handleInputChange}
                        placeholder="Any special requirements or questions"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Quote Summary</CardTitle>
                  <CardDescription>
                    Review your rental quote details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium">Rental Period</div>
                      <div className="flex items-center mt-1">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>
                          {dateRange.from
                            ? dateRange.from.toLocaleDateString()
                            : "Start date"}
                          {" - "}
                          {dateRange.to
                            ? dateRange.to.toLocaleDateString()
                            : "End date"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {rentalDays} day{rentalDays !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="text-sm font-medium">
                        Equipment (
                        {quoteItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}{" "}
                        items)
                      </div>
                      <ul className="mt-2 space-y-2">
                        {quoteItems.map((item) => {
                          const product = products.find(
                            (p) => p.id === item.productId,
                          );
                          if (!product) return null;

                          return (
                            <li
                              key={item.productId}
                              className="flex justify-between text-sm"
                            >
                              <span>
                                {product.name} (x{item.quantity})
                              </span>
                              <span>${product.price * item.quantity}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <Separator />

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Daily Subtotal:</span>
                        <span>${subtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Rental Duration:</span>
                        <span>
                          {rentalDays} day{rentalDays !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total:</span>
                        <span>${total}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  <Button className="w-full" onClick={handleCreateQuote}>
                    Create Quote
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Quote PDF
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:py-0 px-4 md:px-6">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AudioRent Pro. All rights reserved.
          </div>
          <nav className="md:ml-auto flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
