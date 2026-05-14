const testimonialService = require('../services/testimonialService');
const auditService = require('../services/auditService');

const listTestimonials = async (req, res) => {
  try {
    const testimonials = await testimonialService.getTestimonials(req.user);

    return res.status(200).json(testimonials);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialService.getTestimonialById(id, req.user);

    return res.status(200).json(testimonial);
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
};

const listPublicTestimonials = async (req, res) => {
  try {
    const { countrySlug } = req.params;

    const testimonials = await testimonialService.getPublicTestimonialsByCountry(countrySlug);

    return res.status(200).json(testimonials);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const createTestimonial = async (req, res) => {
  try {
    const testimonial = await testimonialService.createTestimonial(req.body, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CREAR',
      modulo: 'testimonios',
      registro_id: testimonial.id,
      descripcion: `Testimonio creado: ${testimonial.nombre}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(201).json({
      message: 'Testimonio creado correctamente',
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await testimonialService.updateTestimonial(
      id,
      req.body,
      req.user
    );

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ACTUALIZAR',
      modulo: 'testimonios',
      registro_id: id,
      descripcion: `Testimonio actualizado: ${testimonial.nombre}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json({
      message: 'Testimonio actualizado correctamente',
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const toggleTestimonialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const testimonial = await testimonialService.toggleTestimonialStatus(
      id,
      estado,
      req.user
    );

    auditService.register({
      usuario_id: req.user.id,
      accion: 'CAMBIAR_ESTADO',
      modulo: 'testimonios',
      registro_id: id,
      descripcion: `Estado de testimonio cambiado a: ${estado}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json({
      message: 'Estado del testimonio actualizado correctamente',
      data: testimonial,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await testimonialService.deleteTestimonial(id, req.user);

    auditService.register({
      usuario_id: req.user.id,
      accion: 'ELIMINAR',
      modulo: 'testimonios',
      registro_id: id,
      descripcion: `Testimonio eliminado con id: ${id}`,
      ip: req.ip,
    }).catch(() => {});

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  listTestimonials,
  getTestimonial,
  listPublicTestimonials,
  createTestimonial,
  updateTestimonial,
  toggleTestimonialStatus,
  deleteTestimonial,
};
