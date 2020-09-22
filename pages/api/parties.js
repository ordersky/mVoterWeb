import MaePaySohAPI from '../../gateway/api';

export default async function (req, res) {
  try {
    const {
      page,
      item_per_page = 25,
    } = req.query;

    const api = new MaePaySohAPI(req.cookies.token);
    const response = await api
      .getParties({ page: req.query.page, item_per_page });

    return res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Internal server error');
  }
}
