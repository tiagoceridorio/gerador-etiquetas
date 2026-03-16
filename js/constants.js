const PRESETS = [
  { type: 'Sal', name: 'Estimulante', desc: 'Gengibre & Canela', emoji: '🫚🍂', usage: 'sal', banner: false },
  { type: 'Sal', name: 'Hidratante', desc: 'Aveia com Oleo de Coco', emoji: '🌾🥥', usage: 'sal', banner: false },
  { type: 'Sal', name: 'Calmante', desc: 'Melissa & Maracuja', emoji: '🌿🍈', usage: 'sal', banner: false },
  { type: 'Sal', name: 'Esfoliante', desc: 'Rosas & Alecrim', emoji: '🌹🌿', usage: 'sal', banner: false },
  { type: 'Sal', name: 'Relaxante', desc: 'Lavanda & Camomila', emoji: '🪻🌼', usage: 'sal', banner: false },
  { type: 'Sal', name: 'Noturno', desc: 'Erva-Doce & Camomila', emoji: '🌱🌼', usage: 'sal', banner: true, bannerColor: '#3c2814', bannerFontColor: '#f5edd8' },
  { type: 'Sal', name: 'Refrescante', desc: 'Hortela & Eucalipto', emoji: '🍃🌿', usage: 'sal', banner: false },
  { type: 'Jelly', name: 'Calmante', desc: 'Lavanda', emoji: '🪻', usage: 'jelly', banner: false }
];

const USAGE_TEXTS = {
  sal: 'Adicione todo o conteudo da embalagem em 3 a 4 litros de agua morna e misture ate dissolver.\nMergulhe os pes e relaxe por 15 a 20 minutos.\nPara finalizar, retire os pes e seque bem.',
  jelly: 'Adicione todo o conteudo da embalagem em 3 a 4 litros de agua morna e misture ate formar o gel.\nMergulhe os pes e relaxe por 15 a 20 minutos.\nPara finalizar, adicione o desativador e misture ate que o gel retorne ao estado liquido, facilitando o descarte.'
};
