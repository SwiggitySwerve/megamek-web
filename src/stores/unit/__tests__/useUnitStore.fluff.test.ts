import { createNewUnitStore } from '@/stores/unit/useUnitStore';
import { TechBase } from '@/types/enums/TechBase';

function createStore(id: string, name: string) {
  return createNewUnitStore({
    id,
    name,
    tonnage: 50,
    techBase: TechBase.INNER_SPHERE,
  });
}

describe('unit fluff actions', () => {
  it('merges lore patches and keeps isolated unit drafts independent', () => {
    const first = createStore(
      '11111111-1111-4111-8111-111111111111',
      'First A',
    );
    const second = createStore(
      '22222222-2222-4222-8222-222222222222',
      'Second B',
    );

    first.setState({
      isModified: false,
      fluff: {
        history: 'Existing history',
        variants: 'Existing variants',
        systemManufacturer: { Engine: 'Vlar' },
      },
    });
    second.setState({ role: 'Scout', fluff: { overview: 'Second overview' } });

    first.getState().setRole('Brawler');
    first.getState().updateFluff({ overview: 'First overview' });

    expect(first.getState()).toMatchObject({
      role: 'Brawler',
      isModified: true,
      fluff: {
        overview: 'First overview',
        history: 'Existing history',
        variants: 'Existing variants',
        systemManufacturer: { Engine: 'Vlar' },
      },
    });
    expect(second.getState()).toMatchObject({
      role: 'Scout',
      fluff: { overview: 'Second overview' },
    });
  });
});
