export enum MemberRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  GUEST = 'guest',
}

export enum MemberStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  CANCELED = 'canceled',
  DELETED = 'deleted',
}

export class MemberStatusMachine {
  private static readonly transitions: Record<MemberStatus, MemberStatus[]> = {
    pending: [
      MemberStatus.ACTIVE,
      MemberStatus.REJECTED,
      MemberStatus.CANCELED,
    ],
    active: [MemberStatus.CANCELED, MemberStatus.DELETED],
    rejected: [],
    canceled: [],
    deleted: [],
  };

  private readonly state: MemberStatus;

  constructor(initialState: MemberStatus) {
    this.state = initialState;
  }

  get current(): MemberStatus {
    return this.state;
  }

  canTransition(to: MemberStatus): boolean {
    return MemberStatusMachine.transitions[this.state]?.includes(to);
  }
}
