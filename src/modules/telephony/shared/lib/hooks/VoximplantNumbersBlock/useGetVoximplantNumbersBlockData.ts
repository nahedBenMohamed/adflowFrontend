import { useMemo } from 'react';
import { VoximplantNumberRow, type PhoneNumber, type VoximplantNumber } from '../../models';

export const useGetVoximplantNumbersBlockData = ({
  numbers,
  availableNumbers,
}: {
  numbers?: VoximplantNumber[];
  availableNumbers?: PhoneNumber[];
}): VoximplantNumberRow[] =>
  useMemo<VoximplantNumberRow[]>(() => {
    if (!availableNumbers || !numbers) return [];

    const mappedNumbersIds: number[] = [];

    return [
      ...availableNumbers.map<VoximplantNumberRow>(a => {
        const number = numbers.find(n => n.externalId === a.externalId);

        if (number) mappedNumbersIds.push(number.id);

        return new VoximplantNumberRow({
          id: number?.id ?? null,
          externalId: a.externalId,
          regionName: a.regionName,
          phoneNumber: a.phoneNumber,
          countryCode: a.countryCode,
          isExistsInVoximplant: true,
          isConnected: Boolean(number),
          userIds: number?.userIds ?? [],
        });
      }),
      ...numbers
        .filter(n => !mappedNumbersIds.includes(n.id))
        .map<VoximplantNumberRow>(
          n =>
            new VoximplantNumberRow({
              id: n.id,
              externalId: n.externalId,
              isConnected: false,
              userIds: n.userIds ?? [],
              phoneNumber: n.phoneNumber,
              isExistsInVoximplant: false,
            })
        ),
    ];
  }, [numbers, availableNumbers]);
