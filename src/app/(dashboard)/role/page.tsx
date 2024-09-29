"use client";
import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  SortDescriptor,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Checkbox,
  ModalFooter,
} from "@nextui-org/react";
import { roleColumns, statusOptions } from "@/lib/data";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react";
import { capitalize } from "@/lib/utils";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent } from "@/components/ui/card";
import { EditIcon } from "@/components/Icons/EditIcon";
import { DeleteIcon } from "@/components/Icons/DeleteIcon";
import { RoleService } from "@/api/services/role.service";
import { IRoleModel, RoleModel } from "@/api/models/role.model";
import { z } from "zod";
import { roleSchema } from "@/lib/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { LuEyeOff, LuEye } from "react-icons/lu";

type FormData = z.infer<typeof roleSchema>;
export default function Role() {
  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );

  const [statusFilter, setStatusFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "age",
    direction: "ascending",
  });

  const [roles, setRoles] = React.useState<IRoleModel[]>([]);

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const roleService = new RoleService();

  const [isLoading, setIsLoading] = React.useState(false);

  const [isUpdate, setIsUpdate] = React.useState(false);

  const [isModalCreate, setModalCreate] = React.useState(false);
  const [isModalActive, setModalActive] = React.useState(false);
  const [state, setState] = React.useState("");
  const [dataRole, setDataRole] = React.useState<RoleModel>();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(roleSchema),
  });

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const data = await roleService.getAll();
      setRoles(data);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchRoles();
  }, []);
  useEffect(() => {}, [state]);
  useEffect(() => {}, [dataRole]);
  useEffect(() => {
    if (dataRole) {
      setValue("name", dataRole.name);
      setValue("isActive", dataRole.isActive);
    }
  }, [dataRole, setValue]);
  const filteredItems = React.useMemo(() => {
    let filteredRoles = [...roles];

    // Filter berdasarkan nama
    if (hasSearchFilter) {
      filteredRoles = filteredRoles.filter((role) =>
        role.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Filter berdasarkan status
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredRoles = filteredRoles.filter((role) => {
        // Ubah isActive menjadi "Active" atau "Inactive" sesuai nilai boolean-nya
        const status = role.isActive ? "Active" : "Inactive";
        return Array.from(statusFilter).includes(status);
      });
    }

    return filteredRoles;
  }, [roles, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: RoleModel, b: RoleModel) => {
      const first = a[sortDescriptor.column as keyof RoleModel] as number;
      const second = b[sortDescriptor.column as keyof RoleModel] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (role: RoleModel, columnKey: React.Key) => {
      const cellValue = role[columnKey as keyof RoleModel];

      switch (columnKey) {
        case "name":
          return <p>{role.name}</p>;
        case "status":
          return (
            <Chip
              className="capitalize"
              color={role.isActive ? "success" : "danger"}
              size="sm"
              variant="flat"
            >
              {role.isActive ? "Active" : "Inactive"}
            </Chip>
          );
        case "actions":
          return (
            <div className="justify-center">
              <div className="flex items-center justify-center gap-2">
                <Tooltip content={role.isActive ? "Active" : "Inactive"}>
                  <span
                    onClick={() => {
                      if (role.isActive) {
                        setState("Inactive");
                      } else {
                        setState("Active");
                      }
                      setDataRole(role);
                      setModalActive(true);
                    }}
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                  >
                    {role.isActive ? <LuEye /> : <LuEyeOff />}
                  </span>
                </Tooltip>
                <Tooltip content="Edit role">
                  <span
                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                    onClick={() => {
                      setModalCreate(true);
                      setDataRole(role);
                    }}
                  >
                    <EditIcon />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Delete role">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </div>
            </div>
          );
        default:
          if (cellValue instanceof Date) {
            return cellValue.toLocaleDateString();
          }
          return cellValue?.toString();
      }
    },
    []
  );

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsUpdate(true);
    try {
      const role: RoleModel = {
        ...data,
        isActive: data.isActive ?? false,
      };

      if (dataRole && dataRole.id) {
        role.id = dataRole.id;
        const result = await roleService.update(role.id, role);
        if (result?.error) {
          toast.error(result.error);
          setIsUpdate(false);
        } else {
          toast.success("Successfully updated");
          setModalCreate(false);
          fetchRoles();
          setIsUpdate(false);
          reset();
          setDataRole(new RoleModel());
        }
      } else {
        const result = await roleService.create(role);
        if (result?.error) {
          toast.error(result.error);
          setIsUpdate(false);
        } else {
          toast.success("Successfully updated");
          setModalCreate(false);
          fetchRoles();
          setIsUpdate(false);
          reset();
          setDataRole(new RoleModel());
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setIsUpdate(false);
        toast.error(error.message); // Tangani error jika ada
      } else {
        setIsUpdate(false);
        toast.error("Terjadi kesalahan yang tidak terduga");
      }
    }
  };

  const changeState = async () => {
    setIsUpdate(true);
    try {
      if (!dataRole) {
        toast.error("Role data is undefined");
        setIsUpdate(false);
        return; // Exit the function if dataRole is undefined
      }

      // Toggle the isActive property
      dataRole.isActive = !dataRole.isActive;

      const role: RoleModel = {
        ...dataRole,
        isActive: dataRole.isActive, // Use the updated isActive value
      };

      if (role.id === undefined) {
        toast.error("Role ID is undefined");
        setIsUpdate(false);
        return; // Exit if id is not available
      }

      const result = await roleService.update(role.id, role);

      if (result?.error) {
        toast.error(result.error);
        setIsUpdate(false);
      } else {
        toast.success("Successfully changed state");
        setModalActive(false);
        fetchRoles();
        setIsUpdate(false);
      }
    } catch (error) {
      setIsUpdate(false);
      if (error instanceof Error) {
        toast.error(error.message); // Handle known errors
      } else {
        toast.error("Terjadi kesalahan yang tidak terduga"); // Handle unexpected errors
      }
    }
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Button
              color="primary"
              endContent={<PlusIcon />}
              onClick={() => {
                setModalCreate(true);
              }}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {roles.length} roles
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onSearchChange,
    onRowsPerPageChange,
    roles.length,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center  items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <ContentLayout title="Role">
      <Card className="rounded-lg border-none ">
        <CardContent className="p-6">
          <Table
            aria-label="Example table with custom cells, pagination and sorting"
            isHeaderSticky
            bottomContent={bottomContent}
            bottomContentPlacement="outside"
            classNames={{
              wrapper: "max-h-[100vh]",
            }}
            selectedKeys={selectedKeys}
            sortDescriptor={sortDescriptor}
            topContent={topContent}
            topContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
          >
            <TableHeader columns={roleColumns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                  allowsSorting={column.sortable}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody
              emptyContent={"No roles found"}
              items={sortedItems}
              isLoading={isLoading}
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Modal
            isOpen={isModalCreate}
            onClose={() => setModalCreate(false)}
            placement="top-center"
          >
            <ModalContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ModalHeader className="flex flex-col gap-1">
                  Create Role
                </ModalHeader>
                <ModalBody>
                  <div className="relative ">
                    <Input
                      autoFocus
                      placeholder="Enter role name"
                      variant="bordered"
                      {...register("name")}
                      color={errors.name ? "danger" : "default"}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm absolute -bottom-5 left-0">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="flex py-2 px-1 justify-between">
                    <Checkbox
                      classNames={{
                        label: "text-small",
                      }}
                      {...register("isActive")}
                    >
                      Active
                    </Checkbox>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onClick={() => {
                      setModalActive(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" color="primary" isLoading={isUpdate}>
                    Save
                  </Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <Modal
            backdrop="blur"
            isOpen={isModalActive}
            onClose={() => setModalActive(false)}
          >
            <ModalContent>
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Change Status
                </ModalHeader>
                <ModalBody>
                  <h1 className="text-xl font-bold">
                    Are you sure change state to {state}
                  </h1>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onClick={() => {
                      setModalActive(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    onClick={() => {
                      changeState();
                    }}
                  >
                    Save
                  </Button>
                </ModalFooter>
              </>
            </ModalContent>
          </Modal>
        </CardContent>
      </Card>
    </ContentLayout>
  );
}
