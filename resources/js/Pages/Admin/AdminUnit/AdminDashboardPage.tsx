import { Card, CardBody, CardFooter, CardHeader, Typography } from "@material-tailwind/react";
import { BarChartBig } from "lucide-react";
import { useTheme } from "@/Hooks/useTheme";
import { MTColor, PageProps } from "@/types";
import { AdminUnitLayout } from "@/Layouts/AdminUnitLayout";

export default function AdminDashboardPage({ auth, pegawais }: PageProps<{
    pegawais: {}[]
}>) {
    const { theme } = useTheme();
    const cardData = [
        {
            color: "gray",
            icon: <BarChartBig />,
            title: "Today's Money",
            value: "$53k",
            footer: {
                color: "text-green-500",
                value: "+55%",
                label: "than last week",
            },
        },
        {
            color: "gray",
            icon: <BarChartBig />,
            title: "Today's Users",
            value: "2,300",
            footer: {
                color: "text-green-500",
                value: "+3%",
                label: "than last month",
            },
        },
        {
            color: "gray",
            icon: <BarChartBig />,
            title: "New Clients",
            value: "3,462",
            footer: {
                color: "text-red-500",
                value: "-2%",
                label: "than yesterday",
            },
        },
        {
            color: "gray",
            icon: <BarChartBig />,
            title: "Sales",
            value: "$103,430",
            footer: {
                color: "text-green-500",
                value: "+5%",
                label: "than yesterday",
            },
        },
    ];

    return (

        <AdminUnitLayout>
            <div className="mt-12">
                <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                    {cardData.map(({ icon, title, footer, color, value }, index) => (
                        <Card key={index} className="border border-blue-gray-100 shadow-sm">
                            <CardHeader
                                variant="gradient"
                                color={color as MTColor}
                                floated={false}
                                shadow={false}
                                className="absolute grid h-12 w-12 place-items-center"
                            >
                                {icon}
                            </CardHeader>
                            <CardBody className="p-4 text-right">
                                <div className="w-10 h-10 bg-blue-300 dark:bg-red-900">

                                </div>
                                <Typography variant="small" className="font-normal text-blue-gray-600">
                                    {title}
                                </Typography>
                                <Typography variant="h4" color="blue-gray">
                                    {value}
                                </Typography>
                            </CardBody>
                            {footer && (
                                <CardFooter className="border-t border-blue-gray-50 p-4">
                                    <Typography className="font-normal text-blue-gray-600">
                                        <strong className={footer.color}>{footer.value}</strong>
                                        &nbsp;{footer.label}
                                    </Typography>
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </AdminUnitLayout>
    );
}
