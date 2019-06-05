export class VM {
    id: string;
    vm_template_id: string;
    keypair_name: string;
    vm_claim_id: string;
    user: string;
    status: string;
    allocated: boolean;
    public_ip: string;
    private_ip: string;
    environment_id: string;
    hostname: string;
}