export enum ParticipationFilter {

    ALL = "ALL", // Projects where user is either owner or collaborator
    COLLABORATOR = "COLLABORATOR", // Projects where user is a collaborator (regardless of role)
    OWNER = "OWNER" // Projects where user is the owner

}

export const ParticipationFilterList = Object.values(ParticipationFilter);