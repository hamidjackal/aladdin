export function parseQuery(filterDto: any): any {
  if (typeof filterDto === 'object' && filterDto?.order) {
    const newDto = JSON.parse(filterDto.order);
    filterDto.order = newDto;
  }
  if (filterDto?.join) {
    const newDto = JSON.parse(filterDto.join);
    filterDto.join = newDto;
  }
  if (filterDto?.where && typeof filterDto.where === 'string') {
    const newDto = JSON.parse(filterDto.where);
    filterDto.where = newDto;
  }
  if (filterDto?.where && Array.isArray(filterDto.where)) {
    const newWhere = filterDto.where.map((item: string) => JSON.parse(item));
    filterDto.where = newWhere;
  }
  return filterDto;
}
