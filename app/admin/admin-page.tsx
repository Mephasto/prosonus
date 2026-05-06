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
import { Headphones, Plus, Pencil, Trash2, Search, Eye } from "lucide-react";
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
import { Product, StoreConfig, Quote } from "@/lib/types";
import {
  dbNewProduct,
  dbUpdateProduct,
  dbDeleteProduct,
  dbUpdateStoreConfig,
} from "@/lib/actions";
import { useProductFilters } from "@/hooks/use-product-filters";
import ProductFilterBar from "@/components/product-filter-bar";
import ImageUpload from "@/components/image-upload";

export default function AdminPage({
  products: initialProducts,
  initialConfig,
  initialQuotes,
}: {
  products: Product[];
  initialConfig: StoreConfig;
  initialQuotes: Quote[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const {
    searchQuery,
    setSearchQuery,
    filterBrand,
    setFilterBrand,
    filterCategory,
    setFilterCategory,
    filteredProducts,
    brands,
    isFiltered,
    clearFilters,
  } = useProductFilters(products);
  const [configForm, setConfigForm] = useState({
    exchangeRate: String(initialConfig.exchangeRate),
  });
  const [configSaving, setConfigSaving] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    brand: "",
    price: "",
    weight: "",
    stock: "",
    specs: "",
    description: "",
    category: "",
    imageUrl: "",
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
      stock: "",
      specs: "",
      description: "",
      category: "",
      imageUrl: "",
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

  const handleSaveConfig = async () => {
    setConfigSaving(true);
    setConfigSaved(false);
    await dbUpdateStoreConfig({
      exchangeRate: parseInt(configForm.exchangeRate, 10) || 1,
    });
    setConfigSaving(false);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  return (
    <div>
      <main className="flex-1">
        <div className="container px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Panel de administración
            </h1>
            <p className="text-muted-foreground">
              Gestioná el catálogo de equipos y los presupuestos de alquiler
            </p>
          </div>

          <Tabs defaultValue="products">
            <TabsList className="mb-4">
              <TabsTrigger value="products">Productos</TabsTrigger>
              <TabsTrigger value="quotes">Presupuestos</TabsTrigger>
              <TabsTrigger value="settings">Configuración</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <div className="mb-4">
                <ProductFilterBar
                  brands={brands}
                  searchQuery={searchQuery}
                  filterBrand={filterBrand}
                  filterCategory={filterCategory}
                  onSearchChange={setSearchQuery}
                  onBrandChange={setFilterBrand}
                  onCategoryChange={setFilterCategory}
                  onClear={clearFilters}
                  isFiltered={isFiltered}
                  resultCount={filteredProducts.length}
                  totalCount={products.length}
                >
                  <Button onClick={() => setIsAddingProduct(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar producto
                  </Button>
                </ProductFilterBar>
              </div>

              {isAddingProduct && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Agregar nuevo producto</CardTitle>
                    <CardDescription>
                      Ingresá los datos del nuevo equipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del producto</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={newProduct.name}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="Mezcladora de Audio Profesional"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand">Marca</Label>
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
                        <Label htmlFor="category">Categoría</Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange(value, "category")
                          }
                          value={newProduct.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccioná una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MICROPHONES">
                              Micrófonos
                            </SelectItem>
                            <SelectItem value="PAS">Sistemas PA</SelectItem>
                            <SelectItem value="MIXERS">Mezcladores</SelectItem>
                            <SelectItem value="HEADPHONES">
                              Audífonos
                            </SelectItem>
                            <SelectItem value="DJ">Equipos DJ</SelectItem>
                            <SelectItem value="CABLES">Cables</SelectItem>
                            <SelectItem value="ACCESOSORIES">
                              Accesorios
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">
                          Precio diario de alquiler (USD)
                        </Label>
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
                        <Label htmlFor="weight">Peso (gramos)</Label>
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
                        <Label htmlFor="stock">Stock</Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          min="0"
                          value={newProduct.stock}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specs">Especificaciones</Label>
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
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={newProduct.description}
                          onChange={(e) => handleInputChange(e)}
                          placeholder="Detailed description of the product"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Imagen del producto</Label>
                        <ImageUpload
                          onUpload={(key) =>
                            setNewProduct((prev) => ({
                              ...prev,
                              imageUrl: key,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingProduct(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleAddProduct}>Agregar producto</Button>
                  </CardFooter>
                </Card>
              )}

              {editingProduct && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Editar producto</CardTitle>
                    <CardDescription>
                      Modificá los datos de este equipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Nombre del producto</Label>
                        <Input
                          id="edit-name"
                          name="name"
                          value={editingProduct.name}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-brand">Marca</Label>
                        <Input
                          id="edit-brand"
                          name="brand"
                          value={editingProduct.brand}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Categoría</Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange(value, "category", true)
                          }
                          value={editingProduct.category}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccioná una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MICROPHONES">
                              Micrófonos
                            </SelectItem>
                            <SelectItem value="PAS">Sistemas PA</SelectItem>
                            <SelectItem value="MIXERS">Mezcladores</SelectItem>
                            <SelectItem value="HEADPHONES">
                              Audífonos
                            </SelectItem>
                            <SelectItem value="DJ">Equipos DJ</SelectItem>
                            <SelectItem value="CABLES">Cables</SelectItem>
                            <SelectItem value="ACCESOSORIES">
                              Accesorios
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">
                          Precio diario de alquiler (USD)
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
                        <Label htmlFor="edit-weight">Peso (gramos)</Label>
                        <Input
                          id="edit-weight"
                          name="weight"
                          value={editingProduct.weight}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-stock">Stock</Label>
                        <Input
                          id="edit-stock"
                          name="stock"
                          type="number"
                          min="0"
                          value={editingProduct.stock ?? ""}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-specs">Especificaciones</Label>
                        <Input
                          id="edit-specs"
                          name="specs"
                          value={editingProduct.specs ?? ""}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="edit-description">Descripción</Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          value={editingProduct.description ?? ""}
                          onChange={(e) => handleInputChange(e, true)}
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Imagen del producto</Label>
                        <ImageUpload
                          currentImageUrl={editingProduct.imageUrl}
                          onUpload={(key) =>
                            setEditingProduct((prev) => ({
                              ...prev,
                              imageUrl: key,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleUpdateProduct}>
                      Guardar cambios
                    </Button>
                  </CardFooter>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Catálogo de productos</CardTitle>
                  <CardDescription>
                    Gestioná el inventario de equipos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Marca</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Precio/día</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>USD {product.price}/día</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Eliminar</span>
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
                      placeholder="Buscar presupuestos..."
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Presupuestos de clientes</CardTitle>
                  <CardDescription>
                    Gestioná los presupuestos y su estado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Período</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Días</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotes.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="text-center py-12 text-muted-foreground"
                          >
                            No hay presupuestos aún.
                          </TableCell>
                        </TableRow>
                      ) : (
                        quotes.map((quote) => (
                          <TableRow key={quote.id}>
                            <TableCell className="font-medium">
                              #{quote.id}
                            </TableCell>
                            <TableCell>
                              <div>{quote.customer.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {quote.customer.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              {quote.customer.company ?? "—"}
                            </TableCell>
                            <TableCell>
                              {quote.startDate
                                ? new Date(quote.startDate).toLocaleDateString(
                                    "es-AR",
                                  )
                                : "—"}
                              {" - "}
                              {quote.endDate
                                ? new Date(quote.endDate).toLocaleDateString(
                                    "es-AR",
                                  )
                                : "—"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  quote.status === "APPROVED"
                                    ? "default"
                                    : quote.status === "PENDING"
                                      ? "outline"
                                      : "destructive"
                                }
                              >
                                {quote.status === "APPROVED"
                                  ? "Aprobado"
                                  : quote.status === "PENDING"
                                    ? "Pendiente"
                                    : "Cancelado"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {quote.totalDays} día
                              {quote.totalDays !== 1 ? "s" : ""}
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={"/admin/quotes/" + quote.id}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Ver detalle</span>
                                  </Link>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="max-w-lg">
                <CardHeader>
                  <CardTitle>Configuración de la tienda</CardTitle>
                  <CardDescription>
                    Variables generales que afectan las vistas públicas del
                    catálogo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="exchangeRate">
                      Tipo de cambio (USD → ARS)
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-12">
                        USD 1 =
                      </span>
                      <Input
                        id="exchangeRate"
                        type="number"
                        min="1"
                        value={configForm.exchangeRate}
                        onChange={(e) =>
                          setConfigForm({
                            ...configForm,
                            exchangeRate: e.target.value,
                          })
                        }
                        className="w-40"
                      />
                      <span className="text-sm text-muted-foreground">ARS</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Los precios en USD se multiplican por este valor para
                      mostrarse en ARS en el catálogo público. Usá 1 para
                      mostrar solo USD.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center gap-3">
                  <Button onClick={handleSaveConfig} disabled={configSaving}>
                    {configSaving ? "Guardando..." : "Guardar cambios"}
                  </Button>
                  {configSaved && (
                    <span className="text-sm text-green-500">
                      ✓ Guardado correctamente
                    </span>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:h-16 md:flex-row md:items-center md:py-0 px-4 md:px-6">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ProSonus. Todos los derechos
            reservados.
          </div>
          <nav className="md:ml-auto flex gap-4 sm:gap-6">
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Términos y condiciones
            </Link>
            <Link
              href="#"
              className="text-xs hover:underline underline-offset-4"
            >
              Privacidad
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
