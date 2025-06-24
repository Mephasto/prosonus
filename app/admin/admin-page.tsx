"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Headphones, Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/lib/types";
import { dbNewProduct, dbUpdateProduct, dbDeleteProduct } from "@/lib/actions";

// Mock data for quotes
const initialQuotes = [
  {
    id: 1,
    customer: "John Smith",
    email: "john@example.com",
    company: "Event Productions",
    startDate: "2023-05-15",
    endDate: "2023-05-18",
    status: "Pending",
    total: 845,
  },
  {
    id: 2,
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    company: "Studio Records",
    startDate: "2023-05-20",
    endDate: "2023-05-25",
    status: "Approved",
    total: 1250,
  },
  {
    id: 3,
    customer: "Michael Brown",
    email: "michael@example.com",
    company: "Wedding DJ Services",
    startDate: "2023-06-01",
    endDate: "2023-06-02",
    status: "Completed",
    total: 450,
  },
];

export default function AdminPage(initialProducts: Product[]) {
  const [products, setProducts] = useState(initialProducts.data);
  const [quotes, setQuotes] = useState(initialQuotes);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    weight: "",
    specs: "",
    description: "",
    category: "",
  });

  const handleEditProduct = (product) => {
    setEditingProduct({ ...product });
  };

  const handleUpdateProduct = () => {
    dbUpdateProduct(editingProduct);
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)),
    );
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dbDeleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleAddProduct = async () => {
    setIsAddingProduct(false);
    const result: Product = await dbNewProduct(newProduct);
    setProducts((prev) => [...prev, { ...newProduct, id: result.id }]);
    setNewProduct({
      name: "",
      brand: "",
      price: "",
      weight: "",
      specs: "",
      description: "",
      category: "",
    });
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingProduct((prev) => ({
        ...prev,
        [name]: name === "price" ? Number(value) : value,
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value, field, isEditing = false) => {
    if (isEditing) {
      setEditingProduct((prev) => ({ ...prev, [field]: value }));
    } else {
      setNewProduct((prev) => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your audio equipment catalog and rental quotes
            </p>
          </div>

          <Tabs defaultValue="products">
            <TabsList className="mb-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="quotes">Quotes</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
                <Button onClick={() => setIsAddingProduct(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>

              {isAddingProduct && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Add New Product</CardTitle>
                    <CardDescription>
                      Enter the details for the new audio equipment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="Professional Audio Mixer"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input
                          id="brand"
                          name="brand"
                          type="text"
                          value={newProduct.brand}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="AudioTech"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange(value, "category")
                          }
                          value={newProduct.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MICROPHONES">
                              Microphones
                            </SelectItem>
                            <SelectItem value="PAS">Speakers</SelectItem>
                            <SelectItem value="MIXERS">Mixers</SelectItem>
                            <SelectItem value="HEADPHONES">
                              Headphones
                            </SelectItem>
                            <SelectItem value="DJ">DJ Equipment</SelectItem>
                            <SelectItem value="CABLES">Cables</SelectItem>
                            <SelectItem value="ACCESOSORIES">
                              Accessories
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Daily Rental Price ($)</Label>
                        <Input
                          id="price"
                          name="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="75"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight</Label>
                        <Input
                          id="weight"
                          name="weight"
                          type="number"
                          value={newProduct.weight}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="5kg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specs">Specifications</Label>
                        <Input
                          id="specs"
                          name="specs"
                          type="text"
                          value={newProduct.specs}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="20Hz-20kHz, 32 Ohm"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={newProduct.description}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="Detailed description of the product"
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingProduct(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddProduct}>Add Product</Button>
                  </CardFooter>
                </Card>
              )}

              {editingProduct && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                    <CardDescription>
                      Update the details for this audio equipment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Product Name</Label>
                        <Input
                          id="edit-name"
                          name="name"
                          value={editingProduct.name}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-brand">Brand</Label>
                        <Input
                          id="edit-brand"
                          name="brand"
                          value={editingProduct.brand}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange(value, "category", true)
                          }
                          value={editingProduct.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MICROPHONES">
                              Microphones
                            </SelectItem>
                            <SelectItem value="PAS">Speakers</SelectItem>
                            <SelectItem value="MIXERS">Mixers</SelectItem>
                            <SelectItem value="HEADPHONES">
                              Headphones
                            </SelectItem>
                            <SelectItem value="DJ">DJ Equipment</SelectItem>
                            <SelectItem value="CABLES">Cables</SelectItem>
                            <SelectItem value="ACCESOSORIES">
                              Accessories
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">
                          Daily Rental Price ($)
                        </Label>
                        <Input
                          id="edit-price"
                          name="price"
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-weight">Weight</Label>
                        <Input
                          id="edit-weight"
                          name="weight"
                          value={editingProduct.weight}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-specs">Specifications</Label>
                        <Input
                          id="edit-specs"
                          name="specs"
                          value={editingProduct.specs}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          value={editingProduct.description}
                          onChange={(e) => handleInputChange(e, true)}
                          rows={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateProduct}>
                      Update Product
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Product Catalog</CardTitle>
                  <CardDescription>
                    Manage your audio equipment inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Daily Rate</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>${product.price}/day</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotes">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search quotes..."
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Quotes</CardTitle>
                  <CardDescription>
                    Manage rental quotes and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Rental Period</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotes.map((quote) => (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">
                            #{quote.id}
                          </TableCell>
                          <TableCell>
                            <div>{quote.customer}</div>
                            <div className="text-sm text-muted-foreground">
                              {quote.email}
                            </div>
                          </TableCell>
                          <TableCell>{quote.company}</TableCell>
                          <TableCell>
                            {new Date(quote.startDate).toLocaleDateString()} -{" "}
                            {new Date(quote.endDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                quote.status === "Approved"
                                  ? "default"
                                  : quote.status === "Pending"
                                    ? "outline"
                                    : "secondary"
                              }
                            >
                              {quote.status}
                            </Badge>
                          </TableCell>
                          <TableCell>${quote.total}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
