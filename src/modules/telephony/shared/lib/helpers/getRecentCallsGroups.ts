import type { RecentCallsGroup, VoximplantCall, VoximplantCallList } from '../models';

export const getRecentCallsGroups = (callLists: VoximplantCallList[]): RecentCallsGroup[] => {
  const callsGroups: RecentCallsGroup[] = [];

  const calls = callLists.reduce<VoximplantCall[]>(
    (calls: VoximplantCall[], c) => [...calls, ...c.calls],
    []
  );

  if (calls) {
    calls.forEach(c => {
      const date = c.createdAt.startOfDay();

      const callGroup = callsGroups.find(cg => cg.date.equals(date));

      const call = callGroup?.calls.find(cg => cg.id === c.id);

      if (call) return;

      if (callGroup) {
        callGroup.calls.push(c);
      } else {
        callsGroups.push({
          date: date,
          calls: [c],
        });
      }
    });
  }

  callsGroups.sort((a, b) => (a.date.greaterThan(b.date) ? -1 : 1));

  return callsGroups;
};
