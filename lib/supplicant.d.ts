export interface SupplicantCreds {
    ssid: string;
    key: string;
}
export interface SupplicantStatus {
    timestamp: number;
    nid?: string;
    wifi_connected: boolean;
    ip_address?: string;
    mac_address: string;
}
export interface Supplicant {
    connect(creds: SupplicantCreds): Promise<string>;
    status(): Promise<SupplicantStatus>;
}
