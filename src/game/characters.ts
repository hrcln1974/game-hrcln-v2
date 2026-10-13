import { CharacterProfile } from '../types/game';

export const CHARACTERS: CharacterProfile[] = [
  {
    id: 'nena',
    name: 'Nena',
    subtitle: 'A Exploradora Ágil',
    description: 'Corajosa, inteligente e ágil. Sempre pronta para novas descobertas! Possui facilidade acrobática para alcançar lugares altos.',
    avatarColor: '#F43F5E',
    jacketColor: '#FB7185',
    hairColor: '#5C382A',
    specialSkill: 'Pulo Duplo e Esquiva Ágil',
    skillDescription: 'Pode saltar uma segunda vez no ar e recuperar o fôlego rapidamente.',
    stats: {
      speed: 8.5,
      jump: 9.0,
      agility: 9.5,
    },
  },
  {
    id: 'pepe',
    name: 'Pepê',
    subtitle: 'O Aventureiro Destemido',
    description: 'Divertido, destemido e cheio de energia. Topa qualquer desafio com entusiasmo contagiante e muita força de vontade.',
    avatarColor: '#2563EB',
    jacketColor: '#3B82F6',
    hairColor: '#452B1E',
    specialSkill: 'Salto Alto e Impacto Firme',
    skillDescription: 'Tem impulso extra em superfícies elásticas e maior alcance vertical.',
    stats: {
      speed: 9.0,
      jump: 9.5,
      agility: 8.0,
    },
  },
  {
    id: 'duo',
    name: 'Nena, Pepê & Bidu',
    subtitle: 'Equipe Completa',
    description: 'A aventura em conjunto! Nena e Pepê revezam no comando e contam com o cãozinho Bidu farejando segredos e protegendo a dupla.',
    avatarColor: '#F59E0B',
    jacketColor: '#EC4899',
    hairColor: '#5C382A',
    specialSkill: 'Faro Canino do Bidu & Escudo Protetor',
    skillDescription: 'Bidu late para afastar ameaças e revela baús e moedas secretas!',
    stats: {
      speed: 9.0,
      jump: 9.2,
      agility: 9.0,
    },
  },
];
