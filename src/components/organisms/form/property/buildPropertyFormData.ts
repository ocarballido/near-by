import { DateTimeMode } from ".";

type LocationsAction = "delete" | "keep" | null;

type BuildArgs = {
    isEdit: boolean;
    locale: string;
    selectedSeedInfoIds: string[];
    dateTimeMode?: DateTimeMode;
    locationsAction?: LocationsAction;
    data: {
        name: string;
        address: string;
        latitude: string;
        longitude: string;
        checkInDate: string;
        checkInTime: string;
        checkOutDate: string;
        checkOutTime: string;
        accessInstructions: string;
        image?: FileList;
    };
};

export function buildPropertyFormData({
    isEdit,
    locale,
    selectedSeedInfoIds,
    dateTimeMode = "isDateAndTime",
    locationsAction = null,
    data,
}: BuildArgs): FormData {
    const fd = new FormData();

    fd.append("name", data.name);
    fd.append("address", data.address);
    fd.append("latitude", data.latitude);
    fd.append("longitude", data.longitude);

    if (!isEdit) {
        fd.append("locale", locale);
        fd.append("seedInfoIds", JSON.stringify(selectedSeedInfoIds));
    }

    if (isEdit && locationsAction) {
        fd.append("locations_action", locationsAction);
    }

    const checkInDateToSend =
        dateTimeMode === "isOnlyTime" ? "" : (data.checkInDate ?? "");
    const checkOutDateToSend =
        dateTimeMode === "isOnlyTime" ? "" : (data.checkOutDate ?? "");

    fd.append("check_in_date", checkInDateToSend);
    fd.append("check_in_time", data.checkInTime ?? "");
    fd.append("check_out_date", checkOutDateToSend);
    fd.append("check_out_time", data.checkOutTime ?? "");
    fd.append("access_instructions", data.accessInstructions ?? "");

    const file = data.image?.[0];
    if (file) fd.append("image", file);

    return fd;
}
